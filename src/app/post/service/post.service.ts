import { Injectable } from "@angular/core";
import { Post } from "../model/post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(post: Post) {
        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe((res) => {
                post.id = res.postId;
                this.posts.push(post);
                this.postUpdated.next([...this.posts]);
            });
    }

    deletePosts(id: string): any {
        this.http.delete('http://localhost:3000/api/posts/' + id)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(x => x.id != id);
                this.posts = updatedPosts;
                this.postUpdated.next([...this.posts]);
            })
    }
}