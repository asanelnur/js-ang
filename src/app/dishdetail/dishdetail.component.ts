import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {expand, flyInOut, visibility} from '../animations/app.animation';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  dish!: Dish;
  dishIds: string[]=[];
  prev: string='';
  next: string='';
  errMess!: string;
  comment!: Comment;
  commentForm!: FormGroup;
  dishcopy!: Dish;
  @ViewChild('cform') commentFormDirective: any;
  @ViewChild('fform') formDirective!: NgForm;
  visibility = 'shown';

  formErrors:any = {
    'author': '',
    'comment': ''
  };
  validationMessages:any = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
    }
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL:string) { }
  ngOnInit() {
    this.createForm();
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required]],
      rating: 5,
      date: ''
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const message = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += message[key] + ' ';
            }
          }
        }
      }
    }
    this.comment = form.value;
  }

  onValueChanged(data?:any){
    if(!this.commentForm){return;}
    const form = this.commentForm;
    for(const field in this.formErrors){
      const f = field as keyof typeof this.formErrors;
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[f] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const message = this.validationMessages[f];
          for(const key in control.errors){
            const k = key  as keyof typeof message;
            if(control.errors){
              if(control.errors.hasOwnProperty(key)){
                this.formErrors[f]+=message[k] + '';
              }
            }
          }
        }
      }
    }
  }


  onSubmit(){
    // this.comment = this.commentForm.value;
    // // this.comment. = new Date().toISOString();
    this.dishcopy.comments.push(this.commentForm.value);
    this.dishservice.putDish(this.dishcopy).subscribe({next:dish=>{this.dish=dish;this.dishcopy=dish},error:errmess=>this.errMess=errmess})
    console.log(this.comment);
    this.comment = new Comment();
    this.formDirective.resetForm();
    this.commentForm.reset({
      rating:5
    });
  }




}
