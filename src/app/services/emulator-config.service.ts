import { Injectable } from '@angular/core';
import { Ch5Emulator } from '@crestron/ch5-crcomlib/build_bundles/umd/@types';
declare var CrComLib: any;

@Injectable({
  providedIn: 'root'
})

export class EmulatorConfigService {
  ch5Emulator: Ch5Emulator = CrComLib.Ch5Emulator.getInstance();
  constructor() { }

  // init emulator
  public initEmulator(emulator: any) {
    CrComLib.Ch5Emulator.clear();
    this.ch5Emulator = CrComLib.Ch5Emulator.getInstance();
    this.ch5Emulator.loadScenario(emulator);
    this.ch5Emulator.run();
  }
}