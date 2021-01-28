import { ObjectType, Field, ID } from '@nestjs/graphql';
import { University } from './university.model';
import { Degree } from './degree.model';
import { GroupedDegrees } from './grouped-degrees.model';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Faculty extends Document {
  @Field(_type => ID)
  get id(): string {
    return super.id as string;
  }

  @Prop()
  @Field()
  name!: string;

  @Prop()
  @Field()
  description!: string;

  @Prop({ type: Types.ObjectId, ref: 'University' })
  @Field(_type => University)
  university!: University | Types.ObjectId;

  @Field(_type => [GroupedDegrees])
  groupedDegrees!: GroupedDegrees[];

  @Field(_type => [Degree])
  degrees!: Degree[];
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
