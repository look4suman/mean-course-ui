import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];

    getPosts(): Post[] {
        return this.posts;
    }

    addPost(post: Post) {
        this.posts.push(post);
    }
}