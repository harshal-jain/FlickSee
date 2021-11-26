import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userImage = "assets/images/user.png";
  
  openNav: boolean = false;

  constructor(public _navService : NavService) { }

  ngOnInit(): void {
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  collaspeSidebar() {
    
    this._navService.collaspeSidebar = !this._navService.collaspeSidebar;
  }

}
