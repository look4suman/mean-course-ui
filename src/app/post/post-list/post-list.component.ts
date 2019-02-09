import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from "../model/post.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubs: Subscription;

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postSubs = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

}
