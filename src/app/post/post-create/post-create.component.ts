import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostService } from "../service/post.service";
import { Post } from "../model/post.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { mimeType } from "./mine-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  private mode: string;
  private postId: string;
  post: Post;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.post = {
      id: null,
      title: "",
      content: "",
      imagePath: null
    };
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        console.log(this.postId);
        this.postService.getPost(this.postId).subscribe(postData => {
          console.log(postData);
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          console.log(this.post);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: null
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onAddPost() {
    this.post.title = this.form.value.title;
    this.post.content = this.form.value.content;

    if (this.mode == "create") {
      this.postService.addPost(this.post, this.form.value.image);
    } else {
      this.postService.updatePost(this.post, this.form.value.image);
    }
    this.form.reset();
    this.router.navigate(["/"]);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
