import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, Platform} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {DataProvider} from "../../providers/data/data";
import {RedditProvider} from "../../providers/reddit/reddit";
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import {InAppBrowser} from "@ionic-native/in-app-browser";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  subredditValue: string;
  subredditControl: FormControl;

  constructor(public navCtrl: NavController,
              public dataService: DataProvider,
              public redditService: RedditProvider,
              public modalCtrl: ModalController,
              public platform: Platform,
              public keyboard: Keyboard,
              public inAppBrowser: InAppBrowser) {

    this.subredditControl = new FormControl();
  }

  ionViewDidLoad() {


    this.subredditControl.valueChanges.debounceTime(1500).distinctUntilChanged()
      .subscribe(subreddit => {

      if(subreddit != '' && subreddit) {
        this.redditService.subreddit = subreddit;
        console.log("Observer executed...")
        console.log(this.redditService.subreddit);
        this.changeSubreddit();
        this.keyboard.close();
      }
    });

    this.platform.ready().then(()=> {
      this.loadSettings();
    })
  }

  //constructor calls this method and get the data on the start
  loadSettings(): void {

    this.dataService.getData().then((settings) => {
      if(settings && typeof (settings) != "undefined") {
        let newSettings = JSON.parse(settings);
        this.redditService.settings = newSettings;

        if(newSettings.length != 0) {
          this.redditService.perPage = newSettings.perPage;
          this.redditService.sort = newSettings.sort;
          this.redditService.subreddit = newSettings.subreddit;
        }
      }
      this.changeSubreddit();
    });
    // console.log("Implement loadSettings()");
  }

  showComments(post): void {
    let browser = this.inAppBrowser.create('https://reddit.com' + post.data.permalink, '_system')
    // console.log("Implement showCommetns()");
  }

  openSettings(): void {
    let settingsModal = this.modalCtrl.create('SettingsPage', {
      perPage: this.redditService.perPage,
      sort: this.redditService.sort,
      subreddit: this.redditService.subreddit
    });

    settingsModal.onDidDismiss(settings => {
      if(settings) {
        this.redditService.perPage = settings.perPage;
        this.redditService.sort = settings.sort;
        this.redditService.subreddit = settings.subreddit;

        this.dataService.save(settings);

        this.changeSubreddit();
      }
    });

    settingsModal.present();
    // console.log("Implement openSettings()");
  }

  playVideo(e, post): void {
    let video = e.target;

    if(!post.alreadyLoaded) {
      post.showLoader = true;
    }

    if(video.paused){
      video.play();

      video.addEventListener("playing", (e)=>{
        post.showLoader = false;
        post.alreadyLoaded = true;
      });
    }
    else {
      video.pause();
    }
    // console.log("TImplement playVideo()");
  }

  changeSubreddit(): void {
    this.redditService.resetPosts();
    // console.log("Implement changeSubreddit()");
  }

  loadMore(): void {
    this.redditService.nextPage();
    // console.log("Implement loadMore()");
  }

}
