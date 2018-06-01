import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  perPage: number;
  sort: string;
  subreddit: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.perPage = this.navParams.get('perPage');
    this.sort = this.navParams.get('sort');
    this.subreddit = navParams.get('subreddit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save():void {
    let settings = {
      perPager: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    };

    this.viewCtrl.dismiss(settings);
  }

  close(): void {
    this.viewCtrl.dismiss();
  }

}
