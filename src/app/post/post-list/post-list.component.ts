import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostService } from "../service/post.service";
import { Post } from "../model/post.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubs: Subscription;
  private authSubs: Subscription;
  userIsAuthenticated: boolean = false;

  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postService.getPosts();
    this.postSubs = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
    this.authSubs.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.deletePosts(id);
  }
}
