import { Component, OnInit } from '@angular/core';
import { Menu } from '../../interface/menu.interface';
import { Global } from '../../services/global';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userImage = "assets/images/user.png"
  logoImage = "assets/images/FlickSee-logo.jpeg"
  menuItems: Menu[];
  fullName: string = "";
  emailId: string = "";

  constructor(public _navService: NavService) { }

  ngOnInit(): void {
    this.menuItems = this._navService.MENUITEMS;

    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.emailId = userDetails.email;
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;

    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "/assets/images/user.png"
      : Global.BASE_USERS_IMAGES_PATH + userDetails.imagePath;

  }

  toggleNavActive(item: Menu) {
    item.active = !item.active;
  }

}
