import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../service/post.service';
import { Post } from "../model/post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public postService: PostService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postService.addPost(post);
  }
}
