import {
  integer,
  serial,
  text,
  pgTable,
  timestamp,
  varchar,
  bigint,
  doublePrecision,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  password: text('password'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  roleId: integer('role_id'),
});

export const role = pgTable('role', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
});

export const refreshToken = pgTable('refresh_token', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(users, {
    fields: [refreshToken.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  user_role: one(role, {
    fields: [users.roleId],
    references: [role.id],
  }),
  project: many(usersToProject),
  forgotPasswordToken: one(forgotPasswordToken, {
    fields: [users.id],
    references: [forgotPasswordToken.userId],
  }),
  workLogs: many(workLog),
}));

export const good = pgTable('good', {
  id: serial('id').primaryKey().notNull(),
  code: varchar('code', { length: 255 }),
  cost: doublePrecision('cost'),
  costMaterial: doublePrecision('cost_material'),
  costOperation: doublePrecision('cost_operation'),
  count: doublePrecision('count'),
  date: varchar('date', { length: 255 }),
  description: varchar('description', { length: 255 }),
  elCost: doublePrecision('el_cost'),
  elMinSize: doublePrecision('el_min_size'),
  elRestSide: doublePrecision('el_rest_side'),
  elWidthPreJoint: doublePrecision('el_width_pre_joint'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  goodId: bigint('good_id', { mode: 'number' }),
  length: doublePrecision('length'),
  name: varchar('name', { length: 255 }),
  orderDate: varchar('order_date', { length: 255 }),
  phone1: varchar('phone1', { length: 255 }),
  phone2: varchar('phone2', { length: 255 }),
  program: varchar('program', { length: 255 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  projectId: bigint('project_id', { mode: 'number' }),
  swComplexBand: boolean('sw_complex_band'),
  swMaxLengthBand: doublePrecision('sw_max_length_band'),
  swMaxSizeBand: doublePrecision('sw_max_size_band'),
  swMaxturns: integer('sw_maxturns'),
  swMinPruning: doublePrecision('sw_min_pruning'),
  swMinSizeBand: doublePrecision('sw_min_size_band'),
  swPackageHeight: doublePrecision('sw_package_height'),
  swSawthick: doublePrecision('sw_sawthick'),
  swSort: integer('sw_sort'),
  swSortInBand: integer('sw_sort_in_band'),
  swTrimIncludeSaw: varchar('sw_trim_include_saw', { length: 255 }),
  thickness: doublePrecision('thickness'),
  typeId: varchar('type_id', { length: 255 }),
  unit: varchar('unit', { length: 255 }),
  width: doublePrecision('width'),
});

export const goodRelations = relations(good, ({ many }) => ({
  images: many(images),
  parts: many(part),
}));

export const images = pgTable('images', {
  id: serial('id').primaryKey().notNull(),
  // TODO: failed to parse database type 'oid'
  data: text('data'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  goodId: bigint('good_id', { mode: 'number' }).references(() => good.id),
});

export const imagesRelation = relations(images, ({ one }) => ({
  good: one(good, {
    fields: [images.goodId],
    references: [good.id],
  }),
}));

export const materials = pgTable('materials', {
  id: serial('id').primaryKey().notNull(),
  count: doublePrecision('count'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  goodId: bigint('good_id', { mode: 'number' }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  operationId: bigint('operation_id', { mode: 'number' }),
  used: varchar('used', { length: 255 }),
});

export const part = pgTable('part', {
  id: serial('id').primaryKey(),
  cLength: doublePrecision('c_length'),
  cWidth: doublePrecision('c_width'),
  code: varchar('code', { length: 255 }),
  count: integer('count'),
  dLength: doublePrecision('d_length'),
  dWidth: doublePrecision('d_width'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  dcId: bigint('dc_id', { mode: 'number' }),
  drill: boolean('drill'),
  dtl: varchar('dtl', { length: 255 }),
  dtw: varchar('dtw', { length: 255 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  goodId: bigint('good_id', { mode: 'number' }).references(() => good.id, {
    onDelete: 'cascade',
  }),
  groove: boolean('groove'),
  jLength: doublePrecision('j_length'),
  jWidth: doublePrecision('j_width'),
  length: doublePrecision('length'),
  mill: boolean('mill'),
  minusCount: integer('minus_count'),
  name: varchar('name', { length: 255 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  partId: integer('part_id'),
  partName: varchar('part_name', { length: 255 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  projectId: bigint('project_id', { mode: 'number' }),
  status: varchar('status', { length: 255 }),
  txt: boolean('txt'),
  usedCount: integer('used_count'),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  userId: bigint('user_id', { mode: 'number' }),
  width: doublePrecision('width'),
  eltMat: varchar('elt_mat', { length: 255 }),
  elbMat: varchar('elb_mat', { length: 255 }),
  ellMat: varchar('ell_mat', { length: 255 }),
  elrMat: varchar('elr_mat', { length: 255 }),
  business: boolean('business'),
});

export const partRelations = relations(part, ({ one }) => ({
  good: one(good, {
    fields: [part.goodId],
    references: [good.id],
  }),
}));

export const project = pgTable('project', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }),
  endDate: varchar('end_date', { length: 100 }),
  name: varchar('name', { length: 255 }),
  priority: varchar('priority', { length: 255 }),
  priorityOrder: integer('priority_order'),
  startDate: varchar('start_date', { length: 100 }),
  orderDate: varchar('order_date', { length: 100 }),
  installationDate: varchar('installation_date', { length: 100 }),
  status: varchar('status', { length: 255 }),
});

export const usersToProject = pgTable(
  'users_to_project',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    projectId: integer('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.projectId),
  }),
);

export const projectRelations = relations(project, ({ many }) => ({
  usersToProject: many(usersToProject),
}));

export const usersToProjectRelations = relations(usersToProject, ({ one }) => ({
  group: one(project, {
    fields: [usersToProject.projectId],
    references: [project.id],
  }),
  user: one(users, {
    fields: [usersToProject.userId],
    references: [users.id],
  }),
}));

export const operation = pgTable('operation', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 255 }),
  name: varchar('name', { length: 255 }),
  code: varchar('code', { length: 255 }),
  cTrimL: doublePrecision('c_trim_l'),
  cTrimW: doublePrecision('c_trim_w'),
  cTrimEW: doublePrecision('c_trim_ew'),
  printable: boolean('printable'),
  startNewPage: boolean('start_new_page'),
  cCostByItem: boolean('c_cost_by_item'),
  cCostByItemRound: integer('c_cost_by_item_round'),
  cCostType: integer('c_cost_type'),
  cCostCut: doublePrecision('c_cost_cut'),
  cFillRep: doublePrecision('c_fill_rep'),
  cCPF: doublePrecision('cCPF'),
  cCombiningParts: varchar('c_combining_parts', { length: 255 }),
  cGroupParts: varchar('c_group_parts', { length: 255 }),
  cMinDimRegWaste1: doublePrecision('c_min_dim_reg_waste1'),
  cMinDimRegWaste2: doublePrecision('c_min_dim_reg_waste2'),
  cBusinessWaste: doublePrecision('c_business_waste'),
  cTrimWaster: boolean('c_trim_waster'),
  cTrimWaste: varchar('c_trim_waste', { length: 255 }),
  cSaveDrawCut: boolean('c_save_draw_cut'),
  csDirectCut: integer('cs_direct_cut'),
  csTexture: boolean('cs_texture'),
  cMinDimDetail: doublePrecision('c_min_dim_detail'),
  width: varchar('width', { length: 255 }),
  t: varchar('t', { length: 255 }),
  length: varchar('length', { length: 255 }),
  cAllowanceWorkpiece: doublePrecision('c_allowance_workpiece'),
  cPrefLargePacket: varchar('c_pref_large_packet', { length: 255 }),
  cSizeMode: integer('c_size_mode'),
  tool1: integer('tool1'),
  cTrimLengthP: doublePrecision('c_trim_length_p'),
  cTrimCountP: integer('c_trim_count_p'),
  cPartCountP: integer('c_part_count_p'),
  cPartsAmountP: doublePrecision('c_parts_amount_p'),
  cWasteAmountP: doublePrecision('c_waste_amount_p'),
  cMaterialAmountP: doublePrecision('c_material_amount_p'),
  typeId: varchar('type_id', { length: 255 }),
  costMaterial: doublePrecision('cost_material'),
  costOperation: doublePrecision('cost_operation'),
  costTotal: doublePrecision('cost_total'),
  data: text('data'),
  cutLength: varchar('cut_length', { length: 255 }),
  cutCount: varchar('cut_count', { length: 255 }),
  cCountPackets: integer('c_count_packets'),
  cTrimLength: doublePrecision('c_trim_length'),
  cTrimCount: integer('c_trim_count'),
  cFilling: doublePrecision('c_filling'),
  cBusinessWasteAmount: doublePrecision('c_business_waste_amount'),
  cPartCount: integer('c_part_count'),
  cPartAmount: doublePrecision('c_part_amount'),
  cMaterialCount: integer('c_material_count'),
  cMaterialAmount: doublePrecision('c_material_amount'),
  cWasteCount: integer('c_waste_count'),
  cWasteAmount: doublePrecision('c_waste_amount'),
  elWastePRC: doublePrecision('el_waste_prc'),
  elCalcMat: boolean('el_calc_mat'),
  elRoundMat: integer('el_round_mat'),
  elRoundLength: integer('el_round_length'),
  elMinDimDetail: varchar('el_min_dim_detail', { length: 255 }),
  elLength: doublePrecision('el_length'),
  elSymbol: varchar('el_symbol', { length: 255 }),
  elColor: varchar('el_color', { length: 255 }),
  elLineMark: integer('el_line_mark'),
  description: varchar('description', { length: 255 }),
  priceBore: doublePrecision('price_bore'),
  priceMill: doublePrecision('price_mill'),
  priceCut: doublePrecision('price_cut'),
  price: doublePrecision('price'),
  side: boolean('side'),
  turn: integer('turn'),
  mirHor: boolean('mir_hor'),
  mirVert: boolean('mir_vert'),
  bySizeDetail: boolean('by_size_detail'),
  program: text('program'),
  count: varchar('count', { length: 255 }),
  countBore: integer('count_bore'),
  costBore: doublePrecision('cost_bore'),
  countMill: doublePrecision('count_mill'),
  costMill: doublePrecision('cost_mill'),
  countCut: doublePrecision('count_cut'),
  costCut: doublePrecision('cost_cut'),
  cost: doublePrecision('cost'),
  typeName: varchar('type_name', { length: 255 }),
  owner: integer('owner'),
  spCalcMat: boolean('sp_calc_mat'),
  cPartAmountP: doublePrecision('c_part_amount_p'),
  spWastePRC: doublePrecision('sp_waste_prc'),
  draw: text('draw'),
  spRestSide: doublePrecision('sp_rest_side'),
  spSizeMode: integer('sp_size_mode'),
  spCost: doublePrecision('sp_cost'),
  grWidth: doublePrecision('gr_width'),
  grDepth: doublePrecision('gr_depth'),
  grOffset: doublePrecision('gr_offset'),
  grOffsetIncl: boolean('gr_offset_incl'),
  grSawthick: doublePrecision('gr_sawthick'),
  grCost: doublePrecision('gr_cost'),
  grCuttingLength: doublePrecision('gr_cutting_length'),
  columns: integer('columns'),
  rows: integer('rows'),
  gap: doublePrecision('gap'),
  margin: boolean('margin'),
  border: integer('border'),
  source: integer('source'),
  printParts: boolean('print_parts'),
  printWastes: boolean('print_wastes'),
  partEach: boolean('part_each'),
  partONZ: boolean('part_onz'),
  partSelected: boolean('part_selected'),
  wasteEach: boolean('waste_each'),
  productEach: boolean('product_each'),
  productONZ: boolean('product_onz'),
  fields: text('fields'),
  workHours: doublePrecision('work_hours'),
  // redundant
  partIds: text('part_ids'),
  projectId: integer('project_id').references(() => project.id, {
    onDelete: 'cascade',
  }),
  workpieceType: text('workpiece_type'),
  order: text('order'),
  parentId: integer('parent_id'),
});

export const operationRelations = relations(operation, ({ one, many }) => ({
  project: one(project, {
    fields: [operation.projectId],
    references: [project.id],
  }),
  operations: many(operation),
  parentOperation: one(operation, {
    fields: [operation.parentId],
    references: [operation.id],
  }),
  images: many(operationsImages),
  workLogs: many(workLog),
}));

export const operationToPart = pgTable(
  'operation_to_part',

  {
    operationId: integer('operation_id')
      .notNull()
      .references(() => operation.id, { onDelete: 'cascade' }),
    partId: integer('part_id')
      .notNull()
      .references(() => part.id),
  },
  (t) => ({
    pk: primaryKey(t.operationId, t.partId),
  }),
);

export const operationToUser = pgTable(
  'operation_to_user',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    operationId: integer('operation_id')
      .notNull()
      .references(() => operation.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.operationId),
  }),
);

export const forgotPasswordToken = pgTable('forgot_password_token', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const operationsImages = pgTable('operations_image', {
  id: serial('id').primaryKey(),
  data: text('data'), // base64 encoded image data
  operationId: integer('operation_id').references(() => operation.id, {
    onDelete: 'cascade',
  }),
});

export const operationsImagesRelations = relations(
  operationsImages,
  ({ one }) => ({
    operation: one(operation, {
      fields: [operationsImages.operationId],
      references: [operation.id],
    }),
  }),
);

export const workLog = pgTable('work_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  operationId: integer('operation_id').references(() => operation.id, {
    onDelete: 'cascade',
  }),
  approvedTimeInSeconds: doublePrecision('approvedTimeInSeconds'),
  registeredTimeInSeconds: doublePrecision('registeredTimeInSeconds'),
});

export const workLogRelations = relations(workLog, ({ one }) => ({
  employee: one(users, {
    fields: [workLog.userId],
    references: [users.id],
  }),
  operation: one(operation, {
    fields: [workLog.operationId],
    references: [operation.id],
  }),
}));
