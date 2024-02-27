import { Component, NgZone } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CrpcContainer } from 'crestron-mediaplayer-sdk';

import { normalizeCommonJSImport } from './utilities/normalizeCommonJSImport';
import { EmulatorConfigService } from './services/emulator-config.service';
const importEruda = normalizeCommonJSImport(
  import('eruda')
);
import * as emulator from '../assets/data/emulator.json';
declare var CrComLib: any;


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [{ provide: APP_BASE_HREF, useValue: './' }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'CRPC';

  constructor(
    private ngZone: NgZone,
    private emulatorConfigService: EmulatorConfigService,
  ) { }

  ngOnInit(): void {
    importEruda.then((eruda: any) => {
      const elem = document.getElementById("erudaContainer");
      eruda.init({ container: elem });
      console.log("eruda init");
    });

    /* Enable CrComLib debug statements */
    CrComLib.Ch5Debug.enableAll();
    CrComLib.Ch5Debug.setConfigKeyValue("bridge.rcbIntervalTimerCallback", false); // Skip this logs

    setTimeout(() => {
      this.subscribeStates();
      this.setNumberButtons();
    }, 2000);
    // this.loadEmulator();

    // setTimeout(() => this.initContainer(), 3000);
  }

  /**
   * Init the CrComLib emulator to work with predefined states and events
   */
  private loadEmulator() {
    /* import('src/assets/data/emulator.json').then(emulator => {
      this.emulatorConfigService.initEmulator(emulator);
    }); */
    this.emulatorConfigService.initEmulator(emulator.default);
  }

  private subscribeStates() {
    CrComLib.subscribeState("s", String(1), (value: boolean) => {
      this.ngZone.run(() => {
        console.log("subscribe serial join 1");
        console.log(value);
      });
    });

    CrComLib.subscribeState("s", String(19), (value: boolean) => {
      this.ngZone.run(() => {
        console.log("subscribe serial join 19");
        console.log(value);
      });
    });
  }

  async initContainer() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const container = new CrpcContainer('5db35e97-a379-46e4-ac32-6b16d5ed6d3e');
    console.log(container);

    // When server sends data, run it into
    container.pipeFromServer('{rpc data from server}');
    /* container.pipeFromServer(
      JSON.stringify({
        "jsonrpc": "2.0",
        "result": {
          "ver": "2.0",
          "name": "MMS Player Main",
          "uuid": "0829abc9-974f-4e71-a793-866657c6eaa4",
          "connectionslist": [
            {
              "type": "symbol/json-rpc",
              "ip": "192.168.33.254",
              "subnet": "255.255.255.0",
              "port": 41794,
              "slot": "5.1.1",
              "join": 55
            },
            {
              "type": "cip-direct/json-rpc",
              "ip": "192.168.33.254",
              "subnet": "255.255.255.0",
              "port": 50011
            }
          ],
          "maxPacketSize": 1048576,
          "encoding": "UTF-8",
          "format": "JSON"
        },
        "error": null,
        "id": 93857
      })
    ); */

    // Whenever the SDK generates data, send it back to the server.
    const subscription = container.pipeToServer.subscribe({
      next: (data: string) => {
        console.log("pipeToServer", data);
        CrComLib.publishEvent("s", String(2), "Test String 2");

        // const encodedMessage = encodeURIComponent(JSON.stringify(data));
        // console.log("encodedMessage", encodedMessage);
        // CrComLib.publishEvent("s", String(2), encodedMessage);
        CrComLib.publishEvent("s", String(2), data);
      },
    });

    // After setting this up, initialize (async method)
    await container.initialize();

    // Getting now playing lines
    if (container.player) {
      container.player.initialize();
      container.player.textLines$.subscribe({
        next: (lines: string[]) =>
          console.log(`Received now playing text lines: ${lines.join(' - ')}`),
      });

      // Or start playing
      container.player.play();
    }
  }

  setNumberButtons() {
    console.log("setNumberButtons");
    CrComLib.publishEvent("n", String(11), 1);
  }

  getData() {
    console.log("getData");
    CrComLib.publishEvent("b", String(19), true);
    CrComLib.publishEvent("b", String(19), false);

    CrComLib.publishEvent("s", String(2), "Test String 1");

    setTimeout(() => this.initContainer(), 1000);
  }
}
