/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ElasticsearchClient } from 'kibana/server';

import { Id, ListSchema, SearchEsListSchema } from '../../../common/schemas';
import { transformElasticToList } from '../utils/transform_elastic_to_list';

interface GetListOptions {
  id: Id;
  esClient: ElasticsearchClient;
  listIndex: string;
}

export const getList = async ({
  id,
  esClient,
  listIndex,
}: GetListOptions): Promise<ListSchema | null> => {
  // Note: This typing of response = await esClient<SearchResponse<SearchEsListSchema>>
  // is because when you pass in seq_no_primary_term: true it does a "fall through" type and you have
  // to explicitly define the type <T>.
  const { body: response } = await esClient.search<SearchEsListSchema>({
    body: {
      query: {
        term: {
          _id: id,
        },
      },
    },
    ignore_unavailable: true,
    index: listIndex,
    seq_no_primary_term: true,
  });
  const list = transformElasticToList({ response });
  return list[0] ?? null;
};
