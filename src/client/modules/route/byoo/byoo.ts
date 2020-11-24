import { LightningElement, api, track } from 'lwc';
import { multiTemplateURLBuilder } from '../../../../server/lib/multiTemplateURLBuilder';

export default class Byoo extends LightningElement {
  @api template;

  @track sandboxURL;
  @track regularURL;

  get scratchUrl() {
    return window.location.href.replace('byoo', 'launch');
  }
  async connectedCallback() {
    const authURL = multiTemplateURLBuilder(this.template, '/authURL');
    // console.log(authURL);
    this.regularURL = await (await fetch(authURL)).text();
    this.sandboxURL = await (await fetch(`${authURL}&base_url=https://test.salesforce.com`)).text();
  }

  get templateArray() {
    // console.log(this.template);
    const tempArray = Array.isArray(this.template) ? this.template : [this.template];
    let templateArray = tempArray.map(function(x){
     return {'value': x, 'label': x.substring(x.lastIndexOf('/') + 1)}
    });
    console.log(templateArray);
    return templateArray;
  }
}
