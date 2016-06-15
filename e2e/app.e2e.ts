import { S4Page } from './app.po';

describe('s4 App', function() {
  let page: S4Page;

  beforeEach(() => {
    page = new S4Page();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('s4 works!');
  });
});
