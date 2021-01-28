import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Faculty } from './faculty.model';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Degree extends Document {
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

  @Prop({ type: Types.ObjectId, ref: 'Faculty' })
  @Field(_type => Faculty)
  faculty!: Faculty | Types.ObjectId;

  @Prop()
  @Field()
  level!: string;
}

export const DegreeSchema = SchemaFactory.createForClass(Degree);
