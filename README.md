# Klient REST

![badge-coverage](.github/badges/coverage.svg)

- [Introduction](#introduction)
- [Setup](#setup)
- [Usage](#usage)
- [Parameters](#parameters)
- [Registry](#registry)
  * [Methods](#methods)
    + [register](#register)
    + [unregister](#unregister)
    + [resource](#resource)
- [Resource](#resource-1)
  * [Constructor arguments](#constructor-arguments)
  * [Methods](#methods-1)
    + [create](#create)
    + [list](#list)
    + [read](#read)
    + [update](#update)
    + [delete](#delete)
    + [uri](#uri)
- [Custom resources](#custom-resources)
- [Events](#events)
  * [ResourceEvent](#resourceevent)

&nbsp;

## Introduction

This [Klient](https://github.com/klientjs/core) extension allows you to work with REST API by defining "resources". A resource represents a group of entrypoints. For exemple, a "User" resource is probably accessible with uri starts with /users or /users/id.

This extension will add a resources registry to Klient instance contening Resource objects (as services) to perform REST actions. The Resource class can be exended to add custom actions on your need.

## Setup

Install package with your favurite package manager :

```bash
# With NPM
$ npm install @klient/rest

# With YARN
$ yarn add @klient/rest
```

Then import the extension in your code :

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Check if extension is loaded
//
console.log(klient.extensions); // Print ['@klient/rest']
```

## Usage

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Listen for resources actions
//
klient.on('request', e => {
  if (e.context.action === 'create' && e.context.resource === 'Post' && e.context.rest === true) {
    console.log('You\'re trying to create a Post');
  }
});


//
// Get resource object
//
const postResource = klient.resource('Post');


//
// Build new fresh item
//
const postItem = {
  title: '...',
  content: '...',
};


//
// Create object by making a request to /users with POST method
//
postResource.create(postItem).then(createdItem => {
  console.log(createdItem);
});
```

## Parameters

```javascript
import Klient from '@klient/core';
import { Resource } from '@klient/rest'
import CustomResource from './resources/custom';

//
// Build Klient instance
//
const klient = new Klient({
  rest: {
    // This parameter is analyzed only on Klient instanciation 
    // Expect object like { resourceAlias: string | Resource }
    load: {
      Post: '/posts',
      Custom: new CustomResource()
    },
  }
})
```

## Registry

The registry is able to configure and store resources.

### Methods

#### register
---

Register a resource in storage.

```typescript
/**
 * @param entrypoint -> Required if nameOrResource is a string
 */
register(nameOrResource: string | Resource, entrypoint: string | undefined): Klient;
```

*Example*

```js
import Klient from '@klient/core';
import { Resource } from '@klient/rest';
import CustomResource from './resources/custom';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register resources
//
klient
  .register('Post', '/posts')
  .register(new Resource('Foo', '/foos', 'identifier'))
  .register(new CustomResource())
;
```

&nbsp;

#### unregister
---

Unregister a resource from storage.

```typescript
unregister(nameOrResource: string | Resource): Klient;
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register resources
//
klient.register('Post', '/posts');
console.log(klient.resource('Post')); // Print Resource instance


//
// Unregister
//
klient.unregister('Post');
console.log(klient.resource('Post')); // Print undefined
```

&nbsp;

#### resource
---

Get a resource from storage.

```typescript
resource(name: string): Resource
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extention
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Work with resources
//
klient.resource('Post').list();
```

&nbsp;

## Resource

A Resource is a service able to perform actions for a specific API resource.

### Constructor

*Arguments are defined in the order they are expected. They will hydrate readonly properties into resource instance.*

| Name               | Type     | Description                                                                                       | Required | Default |
|--------------------|----------|---------------------------------------------------------------------------------------------------|:---------|:--------|
| name               | `string` | The name of resource. Must be uniq.                                                               | Yes      |         |
| entrypoint         | `string` | The base entrypoint of every uri.                                                                 | Yes      |         |
| identifierProperty | `string` | The identifier property of managed items.                                                         | No       | "id"    |
| iriProperty        | `string` | The IRI property of managed objects. IRI are "the address" of object in API like "/users/1"       | No       | "@id"   |

*Example*

```js
import Klient from '@klient/core';
import { Resource } from '@klient/rest';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Declare new resource well configured
//
const postResource = new Resource(
  'Post',    // Alias
  '/posts',  // Entrypoint
  'id',      // ID property
  '@id'      // @IRI property
);


//
// Register resource to Klient
//
klient.register(postResource);
```

### Methods

#### create
---

Create an item with POST method.

```typescript
create(item: object, config: KlientRequestConfig | AxiosRequestConfig | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Create a resource
//
klient
  .resource('Post')
  .create({ title: 'test' })
  .then(createdItem => {
    console.log(createdItem);
  })
;
```

&nbsp;

#### list
---

Read a collection list with GET method.

```typescript
list(queryParams: object, config: KlientRequestConfig | AxiosRequestConfig | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Fetch a resource list
//
klient
  .resource('Post')
  .list({ someFilter: true })
  .then(list => {
    console.log(list);
  })
;
```

&nbsp;

#### read
---

Read a specific item with GET method.

```typescript
read(itemOrId: object | string | number, config: KlientRequestConfig | AxiosRequestConfig | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Read a resource
//
const postResource = klient.resource('Post');
// with id
postResource.read(123);
// with IRI
postResource.read('/posts/1');
// with object
postResource.read({ id: 123 });
postResource.read({ '@id': '/posts/1' });
```

&nbsp;

#### update
---

Update a specific item with PUT method. The item must contains value in its id property.

```typescript
update(item: object, config: KlientRequestConfig | AxiosRequestConfig | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Read item
//
const item = await klient.resource('Post').read(123);


//
// Update item
//
item.title = 'test';
klient.resource('Post').update(item);
```

&nbsp;

#### delete
---

Delete a specific item with DELETE method.

```typescript
read(itemOrId: object | string | number, config: KlientRequestConfig | AxiosRequestConfig | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Delete a resource
//
klient.resource('Post').delete({ id: 123 }); // By using an object
klient.resource('Post').delete(123);         // By using an id
```

&nbsp;

#### uri
---

Build an uri action.

```typescript
uri(itemOrId: object | string | number, ...parts: string[] | undefined): Promise<AxiosResponse.data>
```

*Example*

```js
import Klient from '@klient/core';

//
// Register extension
//
import '@klient/rest';


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register('Post', '/posts');


//
// Get desired resource instance
//
const postResource = klient.resource('Post');


//
// Build URI
//
postResource.uri();                                  // => /posts
postResource.uri(1);                                 // => /posts/1
postResource.uri('/posts/1', 'comments');            // => /posts/1/comments
postResource.uri({ id: 1 }, 'comments');             // => /posts/1/comments
postResource.uri({ '@id': '/posts/1' }, 'comments'); // => /posts/1/comments
```

&nbsp;

## Custom resources

Create custom resource allows you to define custom actions for a specific resource.

```js
import Klient from '@klient/core';
import { Resource } from '@klient/rest';

//
// Register extension
//
import '@klient/rest';


//
// Create your custom Resource
//
class PostResource extends Resource {
  constructor() {
    super('Post', '/posts');  
  }
  
  // This method is called when Resource is add to registry
  // You can use it to initialize your class
  // onRegistration(klient) {
  //   this.klient = klient;
  // }

  // Example action with custom uri /posts/{id}/activate
  activate(itemOrId) {
    return this.request({
      url: this.uri(itemOrId, 'activate'),
      context: { action: 'activate' },
      method: 'GET',
    });
  }
}


//
// Build Klient instance
//
const klient = new Klient('...');


//
// Register a resource
//
klient.register(new PostResource());


//
// Use your custom resource
//
klient.resource('Post').activate(1).then(...);
```

## Events

### ResourceEvent

> alias = `rest:register`

The ResourceEvent is emitted after resource registration in registry

**Properties**

| Name     | Type       | Description                   |
|----------|------------|-------------------------------|
| resource | `Resource` | The target resource instance. |

