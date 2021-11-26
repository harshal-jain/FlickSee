import { Component, OnInit } from '@angular/core';
import { Menu } from '../../interface/menu.interface';
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
    this.fullName = "Harshal Jain";
    this.emailId = "harshaljain19@gmail.com";
    this.menuItems = this._navService.MENUITEMS;
  }

  toggleNavActive(item: Menu) {
    item.active = !item.active;
  }

}
