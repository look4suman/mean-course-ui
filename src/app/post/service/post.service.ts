import { Injectable } from "@angular/core";
import { Post } from "../model/post.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    getPosts(): Post[] {
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(post: Post) {
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
    }
}