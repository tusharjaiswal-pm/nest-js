import { Injectable, Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffee.constants';

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        return ["buddy brew", "blue bottle", "cafe du monde"];
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeeController],
    providers: [
        CoffeeService,
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS,
            useFactory: (brands: CoffeeBrandsFactory) => brands.create(),
            inject: [CoffeeBrandsFactory]
        }
    ],
    exports: [CoffeeService]
})
export class CoffeeModule { }
