import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeeController],
    providers: [
        CoffeeService,
        {
            provide: "COFFEE_BRANDS",
            useValue: ["buddy brew", "blue bottle", "cafe du monde"]
        }
    ],
    exports: [CoffeeService]
})
export class CoffeeModule { }
