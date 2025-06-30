Check 1
## must_respect_max_speed = speed <= max_speed
```bash
Max speed = 0.00003333333
Current speed = 5 / 240*1000 = 0.00002083333
speed <= Max spped (CHECK PASSED -> must_respect_max_speed)
```

Check 2
## must_respect_latest_time = last_move_latest_time <= tx_earliest_time
```bash
last_move_latest_time = 1750740562818  (posix time)
tx_earliest_time_in_slots = 95604237 (in slot numbers)
tx_earliest_time_in_posix = 1666656000000 + (95604237*1000)
tx_earliest_time_in_posix - last_move_latest_time = 1.15196742*10^{10} (CHECK PASSED -> must_respect_latest_time)
```

Check 3
## must_have_correct_datum = (expected_ship_datum == ship_out_datum) && (ship_out_datum.last_move_latest_time >= tx_latest_time)
``` bash
last_move_latest_time (for new datum) = 1749646077000 (posix time)
tx_latest_time_in_slots = 95604477
tx_latest_time_in_posix = 1666656000000 + (95604477*1000)
last_move_latest_time (new datum) - tx_latest_time_in_posix = -1.26144*10^{10} (CHECK PASSED -> must_have_correct_datum)
```

Check 4
## must_have_correct_value = (initial_fuel_in_UTXO - fuel_burnt) == (final_fuel_value_in_output)
``` bash
initial_fuel_in_UTXO = 20
fuel_burnt = 5
final_fuel_value_in_output = 15
(20 - 5) == 15 (CHECK PASSED -> must_have_correct_value)
```

Check 5
## must_burn_spent_fuel
``` bash
mint: 
Asset Name: 4655454c
Amount: -5
(CHECK PASSED -> must_burn_spent_fuel)
```






