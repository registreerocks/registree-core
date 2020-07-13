import { Field, ObjectType } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';
import { PageInfo } from './page-info';
import { Type } from '@nestjs/common';

export default function Paginated<TItem>(
  TItemClass: Type<TItem>,
): Type<Relay.Connection<TItem>> {
  @ObjectType(`${TItemClass.name}Edge`)
  class Edge implements Relay.Edge<TItem> {
    @Field(_type => String)
    cursor!: string;

    @Field(_type => TItemClass)
    node!: TItem;
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  class Cursor implements Relay.Connection<TItem> {
    @Field(_type => [Edge], { nullable: true })
    edges!: Edge[];

    @Field(_type => PageInfo)
    pageInfo!: PageInfo;

    // @Field(_type => Int)
    // totalCount!: number;
  }
  return Cursor;
}
