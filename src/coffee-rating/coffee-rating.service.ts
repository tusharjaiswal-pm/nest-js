import { Injectable } from '@nestjs/common';

@Injectable()
export class CoffeeRatingService {
    constructor(private readonly coffeeService: CoffeeRatingService) {

    }
}
