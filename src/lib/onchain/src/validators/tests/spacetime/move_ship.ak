use aiken/collection/dict
use aiken/interval.{Finite, Interval, IntervalBound}
use aiken/math.{max}
use asteria/test_mock as mock
use asteria/types.{AssetClass, MoveShip, ShipDatum, Speed}
use asteria/utils.{distance}
use cardano/address.{Address, Script, VerificationKey}
use cardano/assets.{add, from_asset, from_lovelace, zero}
use cardano/transaction.{
  InlineDatum, Input, NoDatum, Output, OutputReference, Spend, Transaction,
}
use spacetime

// ==============================================================================================
// MoveShip Tests
// ==============================================================================================

type MoveTestOptions {
  delta_x: Int,
  delta_y: Int,
  initial_fuel: Int,
  extra_token_amount: Int,
  output_ship_token_amount: Int,
  includes_ship_token: Bool,
  includes_ship_output: Bool,
  includes_pilot_token: Bool,
  preserves_pilot_token: Bool,
  updates_x: Bool,
  updates_y: Bool,
  subtracts_spent_fuel: Bool,
  updates_latest_time: Bool,
  respects_latest_time: Bool,
  burns_spent_fuel: Bool,
}

fn default_move_options() {
  MoveTestOptions {
    delta_x: 10,
    delta_y: 10,
    initial_fuel: 40,
    extra_token_amount: 0,
    output_ship_token_amount: 1,
    includes_ship_token: True,
    includes_ship_output: True,
    includes_pilot_token: True,
    preserves_pilot_token: True,
    updates_x: True,
    updates_y: True,
    subtracts_spent_fuel: True,
    updates_latest_time: True,
    respects_latest_time: True,
    burns_spent_fuel: True,
  }
}

fn move(options: MoveTestOptions) -> Bool {
  let min_ada = from_lovelace(2_000_000)
  let initial_x = -20
  let initial_y = -20
  let fuel_per_step = 1
  let required_fuel = fuel_per_step * distance(options.delta_x, options.delta_y)
  let max_ship_fuel = 100
  let max_speed = Speed { distance: 1, time: 1_000 }
  let earliest_time =
    if options.respects_latest_time {
      10_000
    } else {
      0
    }
  let latest_time = earliest_time + 20_000
  let last_move_latest_time = 5_000
  let admin_token =
    AssetClass { policy: mock.admin_policy, name: mock.admin_token_name }
  let redeemer = MoveShip(options.delta_x, options.delta_y)
  let pilot_address =
    Address {
      payment_credential: VerificationKey(mock.pilot_credential),
      stake_credential: None,
    }
  let ship_address =
    Address {
      payment_credential: Script(mock.ship_credential),
      stake_credential: None,
    }
  let ship_input_value =
    min_ada
      |> add(mock.shipyard_policy, mock.ship_token_name, 1)
      |> add(mock.pellet_credential, "FUEL", options.initial_fuel)
  let ship_output_value =
    min_ada
      |> add(
          mock.shipyard_policy,
          mock.ship_token_name,
          options.output_ship_token_amount,
        )
      |> add(
          mock.pellet_credential,
          "FUEL",
          max(options.initial_fuel - required_fuel, 0),
        )
      |> add("aaaa", "tokenA", options.extra_token_amount)
  let ship_input_datum =
    ShipDatum {
      pos_x: initial_x,
      pos_y: initial_y,
      ship_token_name: mock.ship_token_name,
      pilot_token_name: mock.pilot_token_name,
      last_move_latest_time,
    }
  let ship_output_datum =
    ShipDatum {
      pos_x: if options.updates_x {
        initial_x + options.delta_x
      } else {
        initial_x
      },
      pos_y: if options.updates_y {
        initial_y + options.delta_y
      } else {
        initial_y
      },
      ship_token_name: mock.ship_token_name,
      pilot_token_name: if options.preserves_pilot_token {
        mock.pilot_token_name
      } else {
        "FOO"
      },
      last_move_latest_time: if options.updates_latest_time {
        latest_time
      } else {
        last_move_latest_time
      },
    }
  let ship_input = {
    let output =
      Output {
        address: ship_address,
        value: ship_input_value,
        datum: InlineDatum(ship_input_datum),
        reference_script: None,
      }
    let output_reference =
      OutputReference { transaction_id: mock.transaction_id_1, output_index: 0 }
    Input { output_reference, output }
  }
  let pilot_input = {
    let output = {
      let value =
        if options.includes_pilot_token {
          min_ada
            |> add(mock.shipyard_policy, mock.pilot_token_name, 1)
        } else {
          min_ada
        }
      Output {
        address: pilot_address,
        value,
        datum: NoDatum,
        reference_script: None,
      }
    }
    let output_reference =
      OutputReference { transaction_id: mock.transaction_id_1, output_index: 1 }
    Input { output_reference, output }
  }
  let ship_output =
    Output {
      address: ship_address,
      value: if options.subtracts_spent_fuel {
        ship_output_value
      } else {
        ship_output_value |> add(mock.pellet_credential, "FUEL", required_fuel)
      },
      datum: InlineDatum(ship_output_datum),
      reference_script: None,
    }
  let tx =
    Transaction {
      inputs: [ship_input, pilot_input],
      reference_inputs: [],
      outputs: if options.includes_ship_output {
        [ship_output]
      } else {
        []
      },
      fee: 5_000,
      mint: if options.burns_spent_fuel {
        from_asset(mock.pellet_credential, "FUEL", -required_fuel)
      } else {
        zero
      },
      certificates: [],
      withdrawals: [],
      validity_range: Interval {
        lower_bound: IntervalBound {
          bound_type: Finite(earliest_time),
          is_inclusive: True,
        },
        upper_bound: IntervalBound {
          bound_type: Finite(latest_time),
          is_inclusive: True,
        },
      },
      extra_signatories: [],
      redeemers: [
        Pair(
          Spend(
            OutputReference {
              transaction_id: mock.transaction_id_1,
              output_index: 0,
            },
          ),
          {
            let redeemer_data: Data = redeemer
            redeemer_data
          },
        ),
      ],
      datums: dict.empty
        |> dict.insert(
            mock.transaction_id_1,
            {
              let datum_data: Data = InlineDatum(ship_input_datum)
              datum_data
            },
          ),
      id: mock.transaction_id_3,
      votes: [],
      proposal_procedures: [],
      current_treasury_amount: None,
      treasury_donation: None,
    }
  let result =
    spacetime.spacetime.spend(
      mock.pellet_credential,
      mock.asteria_credential,
      admin_token,
      max_speed,
      max_ship_fuel,
      fuel_per_step,
      Some(ship_input_datum),
      redeemer,
      OutputReference { transaction_id: mock.transaction_id_1, output_index: 0 },
      tx,
    )
  result
}

test move_ok() {
  move(default_move_options())
}

test no_ship_output() fail {
  move(
    MoveTestOptions { ..default_move_options(), includes_ship_output: False },
  )
}

test no_pilot_token() fail {
  move(
    MoveTestOptions { ..default_move_options(), includes_pilot_token: False },
  )
}

test add_extra_token() fail {
  move(MoveTestOptions { ..default_move_options(), extra_token_amount: 1 })
}

test not_enough_fuel() fail {
  move(MoveTestOptions { ..default_move_options(), initial_fuel: 5 })
}

test exceed_max_speed() fail {
  move(MoveTestOptions { ..default_move_options(), delta_x: 30, delta_y: 1 })
}

test no_respect_latest_time() fail {
  move(
    MoveTestOptions { ..default_move_options(), respects_latest_time: False },
  )
}

test not_subtracts_spent_fuel() fail {
  move(
    MoveTestOptions { ..default_move_options(), subtracts_spent_fuel: False },
  )
}

test not_burns_spent_fuel() fail {
  move(MoveTestOptions { ..default_move_options(), burns_spent_fuel: False })
}

test no_update_x() fail {
  move(MoveTestOptions { ..default_move_options(), updates_x: False })
}

test no_update_y() fail {
  move(MoveTestOptions { ..default_move_options(), updates_y: False })
}

test no_update_upper_bound() fail {
  move(MoveTestOptions { ..default_move_options(), updates_latest_time: False })
}

test alter_pilot_token() fail {
  move(
    MoveTestOptions { ..default_move_options(), preserves_pilot_token: False },
  )
}

test no_ship_token_output() fail {
  move(
    MoveTestOptions { ..default_move_options(), output_ship_token_amount: 0 },
  )
}
