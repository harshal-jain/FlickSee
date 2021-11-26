import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userImage="assets/images/user.png"
  logoImage="assets/images/FlickSee-logo.jpeg"


  constructor() { }

  ngOnInit(): void {
  }

}
