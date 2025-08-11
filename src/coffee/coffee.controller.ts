import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffee')
export class CoffeeController {
    constructor(private readonly coffeeService: CoffeeService) { }
    @Get("")
    findAll(@Query() pagination: PaginationQueryDto) {
        return this.coffeeService.findAll(pagination);
        // const {limit,offset} = pagination;
        // return `test string is working limit: ${limit} & Offset: ${offset}`;
    }

    @Get(":id")
    findOne(@Param('id') id: string) {
        return this.coffeeService.findOne(id);
        // return `this is the dynamic route for params ${id}`;
    }

    @Post()
    create(@Body() body: CreateCoffeeDto) {
        const coffeeBody = this.coffeeService.create(body)
        return coffeeBody;
        // return body;
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() body: UpdateCoffeeDto) {
        return this.coffeeService.update(id, body);
        // return body;
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.coffeeService.remove(id);
        // return "this action deletes the body";
    }
}
