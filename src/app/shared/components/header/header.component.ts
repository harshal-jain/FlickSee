import { Component, OnInit } from '@angular/core';
import { Global } from '../../services/global';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userImage = "assets/images/user.png";


  openNav: boolean = false;

  constructor(public _navService: NavService) { }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    
    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "/assets/images/user.png"
      : Global.BASE_USERS_IMAGES_PATH + userDetails.imagePath;
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  collaspeSidebar() {

    this._navService.collaspeSidebar = !this._navService.collaspeSidebar;
  }

}
