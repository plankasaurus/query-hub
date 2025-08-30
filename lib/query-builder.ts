import { ObjectId } from 'mongodb'

export interface FilterCondition {
    field: string
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex' | 'exists'
    value: any
}

export interface GroupByConfig {
    field: string
    alias?: string
}

export interface AggregationConfig {
    field: string
    operation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct'
    alias: string
}

export interface SortConfig {
    field: string
    direction: 1 | -1
}

export interface QueryConfig {
    fileId?: string
    filters: FilterCondition[]
    groupBy: GroupByConfig[]
    aggregations: AggregationConfig[]
    sort: SortConfig[]
    limit?: number
    skip?: number
}

export function buildMongoPipeline(config: QueryConfig): any[] {
    const pipeline: any[] = []

    // Match stage for filters
    if (config.filters.length > 0 || config.fileId) {
        const matchStage: any = {}

        if (config.fileId) {
            matchStage.fileId = new ObjectId(config.fileId)
        }

        config.filters.forEach(filter => {
            const field = filter.field
            const operator = filter.operator
            const value = filter.value

            switch (operator) {
                case 'eq':
                    matchStage[field] = value
                    break
                case 'ne':
                    matchStage[field] = { $ne: value }
                    break
                case 'gt':
                    matchStage[field] = { $gt: value }
                    break
                case 'gte':
                    matchStage[field] = { $gte: value }
                    break
                case 'lt':
                    matchStage[field] = { $lt: value }
                    break
                case 'lte':
                    matchStage[field] = { $lte: value }
                    break
                case 'in':
                    matchStage[field] = { $in: Array.isArray(value) ? value : [value] }
                    break
                case 'nin':
                    matchStage[field] = { $nin: Array.isArray(value) ? value : [value] }
                    break
                case 'regex':
                    matchStage[field] = { $regex: value, $options: 'i' }
                    break
                case 'exists':
                    matchStage[field] = { $exists: value }
                    break
            }
        })

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage })
        }
    }

    // Group stage
    if (config.groupBy.length > 0 || config.aggregations.length > 0) {
        const groupStage: any = {
            _id: config.groupBy.length > 0 ? {} : null
        }

        // Add group by fields
        config.groupBy.forEach(group => {
            if (group.alias) {
                groupStage._id[group.alias] = `$${group.field}`
            } else {
                groupStage._id[group.field] = `$${group.field}`
            }
        })

        // Add aggregation operations
        config.aggregations.forEach(agg => {
            switch (agg.operation) {
                case 'sum':
                    groupStage[agg.alias] = { $sum: `$${agg.field}` }
                    break
                case 'avg':
                    groupStage[agg.alias] = { $avg: `$${agg.field}` }
                    break
                case 'min':
                    groupStage[agg.alias] = { $min: `$${agg.field}` }
                    break
                case 'max':
                    groupStage[agg.alias] = { $max: `$${agg.field}` }
                    break
                case 'count':
                    groupStage[agg.alias] = { $sum: 1 }
                    break
                case 'countDistinct':
                    groupStage[agg.alias] = { $addToSet: `$${agg.field}` }
                    break
            }
        })

        // If no aggregations, just count documents
        if (config.aggregations.length === 0) {
            groupStage.count = { $sum: 1 }
        }

        pipeline.push({ $group: groupStage })
    }

    // Sort stage
    if (config.sort.length > 0) {
        const sortStage: any = {}
        config.sort.forEach(sort => {
            sortStage[sort.field] = sort.direction
        })
        pipeline.push({ $sort: sortStage })
    }

    // Skip stage
    if (config.skip && config.skip > 0) {
        pipeline.push({ $skip: config.skip })
    }

    // Limit stage
    if (config.limit && config.limit > 0) {
        pipeline.push({ $limit: config.limit })
    }

    return pipeline
}

export function validateQueryConfig(config: QueryConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (config.filters.some(f => !f.field || !f.operator)) {
        errors.push('All filters must have a field and operator')
    }

    if (config.groupBy.some(g => !g.field)) {
        errors.push('All group by fields must have a field name')
    }

    if (config.aggregations.some(a => !a.field || !a.operation || !a.alias)) {
        errors.push('All aggregations must have a field, operation, and alias')
    }

    if (config.sort.some(s => !s.field || ![1, -1].includes(s.direction))) {
        errors.push('All sort fields must have a field name and valid direction (1 or -1)')
    }

    if (config.limit && config.limit < 0) {
        errors.push('Limit must be a positive number')
    }

    if (config.skip && config.skip < 0) {
        errors.push('Skip must be a positive number')
    }

    return {
        valid: errors.length === 0,
        errors
    }
}
