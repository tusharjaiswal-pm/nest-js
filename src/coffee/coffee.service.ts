import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection } from 'typeorm/browser';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeeService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: DataSource
    ) { }

    findAll(pagination: PaginationQueryDto) {
        const { limit, offset } = pagination;
        return this.coffeeRepository.find({
            relations: ["flavors"],
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOneBy({ id: Number(id) });
        if (!coffee) {
            throw new HttpException("Coffee Not Found", HttpStatus.NOT_FOUND);
        }
        return coffee;

    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(coffee);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preLoadFlavorByName(name)),
        );
        const coffee = this.coffeeRepository.create({ ...createCoffeeDto, flavors });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && (await Promise.all(updateCoffeeDto.flavors.map(name => this.preLoadFlavorByName(name))))

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        })

        if (!coffee) {
            throw new NotFoundException(`Coffee could not found `)
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.coffeeRepository.findOneBy({ id: Number(id) });
        if (!coffee) {
            throw new NotFoundException(`Coffee could not found `)
        }
        return this.coffeeRepository.remove(coffee);
    }

    private async preLoadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
        if (existingFlavor) {
            return existingFlavor;
        }

        return this.flavorRepository.create({ name })
    }
}
