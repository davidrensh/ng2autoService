/*
 * Angular
 */
import {Component} from '@angular/core';

@Component({
    selector: 'about',
    template:  `
            <div class=" text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
            <div class="card ">
                        <div class="card-header card-inverse card-info">
                            3S Auto Customer Service
                        </div>
                        <div class="card-block">
                            <blockquote class="card-blockquote">
                            <p>    
                                New generation cloud based 3S Auto Customer Service System.<br>
                                <br><br>
                                
                                David Ren<br>
                                780-292-6213 <br>
                                davidrensh@hotmail.com <br>
                            </p>
                            </blockquote>
                        </div>
                        <div class="card-footer text-muted">
                            Product of Meridian IT Service
                        </div>

            </div>
            </div>
`
})
export class About {
}
