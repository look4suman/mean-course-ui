import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor() { }

  postValue = 'initial value';
  textValue = 'initial text';

  ngOnInit() {
  }

  onAddPost() {
    this.postValue = this.textValue;
  }
}
