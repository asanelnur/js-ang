import {Component, Inject, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from "../shared/dishes";
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  dishes!: Dish[];
  errMess!: string;

  constructor(private dishService: DishService,
              @Inject('BaseURL') public BaseURL:string) { }

  ngOnInit(): void {
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
        errmess => this.errMess = <any>errmess);
  }

}
