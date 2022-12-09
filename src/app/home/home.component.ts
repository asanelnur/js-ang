import {Component, Inject, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dish!: Dish;
  promotion!: Promotion;
  dishErrMess!: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    @Inject('BaseURL') public BaseURL:string) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish,
      errmess => this.dishErrMess = <any>errmess);
    this.promotion = this.promotionservice.getFeaturedPromotion();
  }

}
