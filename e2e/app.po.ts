export class S4Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('s4-app h1')).getText();
  }
}
