import { Injectable } from "@angular/core";
import { Post } from "../model/post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", image, post.title);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(res => {
        post.id = res.post.id;
        post.imagePath = res.post.imagePath;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  updatePost(post: Post, image: File | string) {
    let postData: FormData | Post;
    if (typeof image == "object") {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.title,
        imagePath: image
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + post.id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        //post.imagePath = response.imagePath;
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePosts(id: string): any {
    this.http.delete("http://localhost:3000/api/posts/" + id).subscribe(() => {
      const updatedPosts = this.posts.filter(x => x.id != id);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
