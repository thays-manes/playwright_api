import { z } from 'zod';
import { IdSchema, NonEmptyStringSchema } from './common.schema';

const CoordinateSchema = z.string().regex(/^-?\d+(\.\d+)?$/, 'coordenada deve ser numérica em formato texto');

export const GeoSchema = z.object({
  lat: CoordinateSchema,
  lng: CoordinateSchema,
});

export const AddressSchema = z.object({
  street: NonEmptyStringSchema,
  suite: NonEmptyStringSchema,
  city: NonEmptyStringSchema,
  zipcode: NonEmptyStringSchema,
  geo: GeoSchema,
});

export const CompanySchema = z.object({
  name: NonEmptyStringSchema,
  catchPhrase: NonEmptyStringSchema,
  bs: NonEmptyStringSchema,
});

export const UserSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  username: NonEmptyStringSchema,
  email: z.email(),
  address: AddressSchema,
  phone: NonEmptyStringSchema,
  website: NonEmptyStringSchema,
  company: CompanySchema,
});

export const UserListSchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;
