import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map'


@Injectable()
export class RedditProvider {

  settings: any;
  loading: boolean = false;
  posts: any = [];
  subreddit: string = 'gifs';
  page: number = 1;
  perPage: number = 15;
  after: string;
  stopIndex: number;
  sort: string = 'hot';
  moreCount: number = 0;

  constructor(public http: Http) {
    console.log('Hello RedditProvider Provider');
  }

  fetchData(): void {
    let url = 'https://www.reddit.com/r/' + this.subreddit + '/' + this.sort + '/.json?limit=' + this.perPage;

    if (this.after) {
      url += '&after=' + this.after;
    }

    this.loading = true;

    this.http.get(url).map(res => res.json()).subscribe(data => {

      console.log(data);

      let stopIndex = this.posts.length;
      this.posts = this.posts.concat(data.data.children);

     // console.log(this.posts);

      for (let i = this.posts.length - 1; i >= stopIndex; i--) {
        let post = this.posts[i];

        post.showLoader = false;
        post.alreadyLoaded = false;

        if (post.data.thumbnail == 'nsfw') {
          this.posts[i].data.thumbnail = 'images/nsfw.png'
        }

        if (post.data.url.indexOf('.gifv') > -1 || post.data.url.indexOf('.webm') > -1) {
          this.posts[i].data.url = post.data.url.replace('.gifv', '.mp4');
          this.posts[i].data.url = post.data.url.replace('.webm', '.mp4');

          if (typeof (post.data.preview) != 'undefined') {
            this.posts[i].data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');

            if (this.posts[i].data.snapshot == 'undefined') {
              this.posts[i].data.snapshot = "";
            }
          }

          else {
            this.posts[i].data.snapshot = "";
          }
        }

        else {
          this.posts.splice(i, 1);
        }
      }

      if (data.data.children.length === 0 || this.moreCount > 20) {
        this.moreCount = 0;
        this.loading = false;
      }

      else {
        this.after = data.data.children[data.data.children.length - 1].data.name;

        if (this.posts.length < this.perPage * this.page) {
          this.fetchData();
          this.moreCount++;
        }

        else {
          this.loading = false;
          this.moreCount = 0;
        }
      }

    }, (err) => {
      console.log("subreddit doesn't exit!")
    });
  }

  nextPage() {
    this.page++;
    this.fetchData();
  }

  resetPosts() {
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }


}
