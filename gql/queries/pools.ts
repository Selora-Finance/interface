import { graphql } from '../codegen';

export const QUERY_ALL_POOLS = graphql(`
  query AllPools($skip: Int = 0, $limit: Int = 2000) {
    pools(skip: $skip, first: $limit) {
      id
      name
      poolType
      reserve0
      reserve1
      reserveETH
      reserveUSD
      tickSpacing
      token0Price
      token1Price
      totalBribesUSD
      totalEmissions
      totalEmissionsUSD
      totalFees0
      totalFees1
      totalFeesUSD
      totalSupply
      totalVotes
      txCount
      volumeETH
      volumeToken0
      volumeToken1
      volumeUSD
      address
      gaugeFeesUSD
      gaugeFees1CurrentEpoch
      gaugeFees0CurrentEpoch
      token1 {
        address
        derivedETH
        derivedUSD
        id
        name
        symbol
      }
      token0 {
        address
        derivedETH
        derivedUSD
        id
        name
        symbol
      }
      gauge {
        rewardRate
        id
        address
        fees0
        fees1
        isAlive
      }
    }
  }
`);
