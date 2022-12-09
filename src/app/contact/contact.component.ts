import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import {formErrors} from "../shared/formErrors";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective: any ;
  feedbackForm: FormGroup;
  feedback: Feedback = new Feedback();
  contactType = ContactType;
  formErrors = {
    'firstname': "",
    'lastname' : "",
    'telnum': '',
    'email': ""
  };
  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }
  ngOnInit() {
    this.createForm();
  }
  createForm():void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?:any){
    if(!this.feedbackForm){return;}
    const form = this.feedbackForm;
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
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
      this.feedbackFormDirective.resetForm();
  }




}
