import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class Toolbar extends Component {

  componentDidMount() {
    this.btn = document.querySelector('#toolbar .navbar-toggle');
  }

  _close() {
    const style = window.getComputedStyle(this.btn);
    if (style.display === 'block') {
      this.btn.click();
    }
  }

  render() {
    const {router} = this.context;
    const {Header, Brand, Toggle, Collapse} = Navbar;
    return (
      <Navbar id="toolbar" fixedTop={true}>
        <Header>
          <Brand onClick={() => router.push('info')}>편잇점</Brand>
          <Toggle/>
        </Header>
        <Collapse>
          <Nav pullRight>
            <NavItem onSelect={() => {
              this._close();
              router.push('pick');
            }}>편의점 선택</NavItem>
            <NavItem onSelect={() => {
              this._close();
              router.push('stores');
            }}>편의점 목록</NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

Toolbar.contextTypes = {
  router: React.PropTypes.object
};

export default Toolbar;
