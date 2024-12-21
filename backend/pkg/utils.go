package pkg

import "time"

func SinceRefOrNow(ref time.Time, ts time.Time) time.Duration {
	if ref.IsZero() {
		return time.Since(ts)
	}
	return ref.Sub(ts)
}
