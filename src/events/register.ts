import { Event } from '@klient/core';

import type Resource from '../services/resource';

export default class RegisterEvent extends Event {
  static NAME = 'rest:register';

  constructor(public resource: Resource) {
    super();
  }
}
