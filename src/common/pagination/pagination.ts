import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from './page-info';
import { Type } from '@nestjs/common';

export default function Paginated<TItem>(TItemClass: Type<TItem>): any {
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType {
    @Field(_type => String)
    cursor!: string;

    @Field(_type => TItemClass)
    node!: TItem;
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(_type => [EdgeType], { nullable: true })
    edges?: Array<EdgeType>;

    @Field(_type => [TItemClass], { nullable: true })
    nodes?: Array<TItem>;

    @Field(_type => PageInfo)
    pageInfo!: PageInfo;

    @Field(_type => Int)
    totalCount!: number;
  }
  return PaginatedType;
}
