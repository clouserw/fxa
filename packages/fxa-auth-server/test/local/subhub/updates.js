/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const { assert } = require('chai');

const EventEmitter = require('events').EventEmitter;
const sinon = require('sinon');
const { mockDB, mockLog } = require('../../mocks');
const profileUpdates = require('../../../lib/profile/updates');
const P = require('../../../lib/promise');

const mockDeliveryQueue = new EventEmitter();
mockDeliveryQueue.start = function start() { };

function mockMessage(msg) {
  msg.del = sinon.spy();
  return msg;
}

const baseMessage = {
  uid: 'bogusid',
  subscriptionId: '1234',
  active: false,
  eventId: 'st_ev_1234',
  createdAt: 1557265730749
};

function mockProfileUpdates(log) {
  return profileUpdates(log)(mockDeliveryQueue, mockDB());
}

describe('profile updates', () => {
  it(
    'should log errors',
    async () => {
      const log = mockLog();
      await mockProfileUpdates(log).handleProfileUpdated(mockMessage(baseMessage));
      assert.equal(log.error.callCount, 1);
      pushShouldThrow = false;
    }
  );

  it(
    'should send push notifications',
    async () => {
      const log = mockLog();
      const uid = '1e2122ba';

      await mockProfileUpdates(log).handleProfileUpdated(mockMessage(
        Object.assign({}, baseMessage, { uid })
      ));
      assert.equal(log.error.callCount, 0);
    }
  );
});
