/**
 * @swagger
 * parameter:
 *   ppl_search_q:
 *     name: q
 *     description: Text to search in the people resources
 *     in: body
 *     required: false
 *     schema:
 *       type: string
 *   ppl_search_object_types:
 *     name: objectTypes
 *     in: body
 *     required: false
 *     schema:
 *       $ref: "#/definitions/PeopleSearchRequestObjectTypes"
 *   ppl_search_pagination:
 *     name: pagination
 *     in: body
 *     required: false
 *     schema:
 *       $ref: "#/definitions/PeopleSearchRequestPagination"
 *   ppl_search_query_q:
 *     name: q
 *     description: Text to search in the people resources
 *     in: query
 *     type: string
 *   ppl_search_query_limit:
 *     name: limit
 *     description: The maximum number of resources to send back
 *     in: query
 *     type: integer
 *   ppl_search_query_offset:
 *     name: offset
 *     description: The offset to start to sarch resources from
 *     in: query
 *     type: integer
 *   ppl_search_excludes:
 *     name: excludes
 *     description: A list of tuple objects that are meant to be excluded from search
 *     in: body
 *     schema:
 *       type: array
 *       items:
 *         $ref: "#/definitions/Tuple"
 */
