import Klient, { RequestEvent } from '@klient/core';
import { mockAxiosWithRestApi } from '@klient/testing';

import '@klient/jwt';
import '..';

import { Resource, KlientExtended, Parameters, RegisterEvent } from '..';

import type { KlientExtended as JWTKlientExtended } from '@klient/jwt';
import type { Post } from '@klient/testing/dist/esm/api/api';

jest.mock('axios');

mockAxiosWithRestApi();

test('register', async () => {
  const klient = new Klient() as KlientExtended;
  const spyRegisterEvent = jest.fn();

  klient.on('rest:register', (e: RegisterEvent) => {
    spyRegisterEvent(e.resource, e);
  });

  klient.register('Post', '/posts');

  const postResource = klient.resource('Post') as Resource;

  expect(postResource).toBeInstanceOf(Resource);
  expect(spyRegisterEvent).toBeCalledWith(postResource, expect.any(RegisterEvent));

  klient.unregister(postResource);

  expect(klient.resource('Post')).toBeUndefined();

  klient.register(postResource);

  expect(postResource).toBeInstanceOf(Resource);
  expect(spyRegisterEvent).toBeCalledWith(postResource, expect.any(RegisterEvent));

  klient.unregister('Post');

  expect(klient.resource('Post')).toBeUndefined();
});

test('resource', async () => {
  const klient = new Klient({
    jwt: {
      login: {
        url: '/auth',
        method: 'POST'
      }
    }
  }) as JWTKlientExtended & KlientExtended;

  klient.register('Post', '/posts');

  const postResource = klient.resource('Post') as Resource;

  await klient.login({ username: 'test', password: 'test' }).catch((e) => {
    console.log(e);
    throw e;
  });

  const spyRequestEvent = jest.fn();

  klient.on('request', (e: RequestEvent) => {
    spyRequestEvent(e.context.action, e.context.resource, e.context.test);
  });

  let postId = '';

  await postResource
    .create<Post>({ title: 'title', content: 'content' }, { context: { test: true } })
    .then((data) => {
      expect(data.id).toBeDefined();
      expect(data.title).toBe('title');
      expect(data.content).toBe('content');
      expect(spyRequestEvent).toBeCalledWith('create', 'Post', true);
      postId = String(data.id);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .create<Post>({ title: 'title' })
    .then(() => {
      throw new Error('This request must failed');
    })
    .catch((e) => {
      expect(e.response.status).toBe(400);
    });

  await postResource
    .list<Post[]>({ title: 'title' }, { context: { test: true } })
    .then((data) => {
      expect(data).toBeInstanceOf(Array);
      expect(data[0].id).toBe(postId);
      expect(data[0].title).toBe('title');
      expect(data[0].content).toBe('content');
      expect(spyRequestEvent).toBeCalledWith('list', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .list<Post[]>()
    .then((data) => {
      expect(data).toBeInstanceOf(Array);
      expect(data[0].id).toBe(postId);
      expect(data[0].title).toBe('title');
      expect(data[0].content).toBe('content');
      expect(spyRequestEvent).toBeCalledWith('list', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .read<Post>(postId, { context: { test: true } })
    .then((data) => {
      expect(data.id).toBe(postId);
      expect(spyRequestEvent).toBeCalledWith('read', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .read<Post>({ id: postId })
    .then((data) => {
      expect(data.id).toBe(postId);
      expect(spyRequestEvent).toBeCalledWith('read', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .update<Post>(
      {
        id: postId,
        title: 'Super test',
        content: 'Super test'
      },
      {
        context: { test: true }
      }
    )
    .then((data) => {
      expect(data.id).toBe(postId);
      expect(data.id).toBeDefined();
      expect(data.title).toBe('Super test');
      expect(data.content).toBe('Super test');
      expect(spyRequestEvent).toBeCalledWith('update', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .update<Post>({})
    .then(() => {
      throw new Error('This request must failed');
    })
    .catch((e) => {
      expect(e.response.status).toBe(404);
    });

  await postResource
    .delete<Post>(postId, { context: { test: true } })
    .then((data) => {
      expect(data).toBe(null);
      expect(spyRequestEvent).toBeCalledWith('delete', 'Post', true);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  await postResource
    .delete<Post>(postId)
    .then(() => {
      throw new Error('This request must failed');
    })
    .catch((e) => {
      expect(e.response.status).toBe(404);
    });
});

test('uri', () => {
  const klient = new Klient() as KlientExtended;

  klient.register('Post', '/posts');

  const postResource = klient.resource('Post') as Resource;

  expect(postResource.uri()).toBe('/posts');
  expect(postResource.uri({ '@id': '/posts/1' }, 'custom')).toBe('/posts/1/custom');
  expect(postResource.uri({ id: 1 }, 'custom')).toBe('/posts/1/custom');
  expect(postResource.uri({ id: '1' }, 'custom')).toBe('/posts/1/custom');
  expect(postResource.uri('/posts/1', 'custom')).toBe('/posts/1/custom');
  expect(postResource.uri('1')).toBe('/posts/1');
  expect(postResource.uri(1)).toBe('/posts/1');
});

class CustomResource extends Resource {
  constructor() {
    super('Custom', '/customs', 'id');
  }

  customAction() {
    return this.request({ url: '/random' });
  }
}

test('load', async () => {
  const customResource = new CustomResource();
  const spyRequestEvent = jest.fn();

  const klient = new Klient<Parameters>({
    rest: {
      load: {
        Post: '/posts',
        Custom: customResource
      }
    }
  }) as KlientExtended;

  expect(klient.resource('Post')).toBeInstanceOf(Resource);
  expect(klient.resource('Custom')).toBeInstanceOf(CustomResource);

  klient.on('request', (e: RequestEvent) => {
    spyRequestEvent(e.context.action, e.context.resource);
  });

  await customResource
    .customAction()
    .then(() => {
      throw new Error('This request must failed');
    })
    .catch(() => {
      expect(spyRequestEvent).toBeCalledWith('request', 'Custom');
    });
});
