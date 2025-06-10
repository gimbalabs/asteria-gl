





// Receive UTXOs,collateral, coordinates to move the ship from the user/frontend
// Note: The frontend checks if the coordinates are in range based on fuel available
// Filter/check for the UTXO with pilot token
// If not available, return error/message
// If available move to next steps below:
// Query/Index the corresponding shipState UTXO from the spacetime validator address
// In the shipState UTXO, we need TXId, TxIndex, datum, and tokens
// Calculate deltax and delta y
// Construct the redeemer w/ change in x and y (deltax and delta y)
// Construct the new datum for the new shipState UTXO
// Calculate the upper and lower bounds of the new tx_latest_posix_time based on deltax and delta y
// If the new tx_latest_posix_time is out of bounds, return error/message
// If the new tx_latest_posix_time is within bounds, move to next step:
// Build the Tx using TxBuilder
// Send the unsignedTx to the frontend to sign and submit

// Note: Think some more about the latest_posix_time and the bounds
