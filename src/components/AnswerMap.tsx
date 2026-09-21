import { useCallback, useEffect } from 'react'
import { DomEvent, divIcon } from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { Investigation, LatLng } from '../types/location'
import type { MapView } from '../data/mapView'
import { investigationPinLabel } from '../logic/investigationPin'
import 'leaflet/dist/leaflet.css'

interface Props {
  guess: LatLng | null
  target?: LatLng | null
  investigations?: readonly Investigation[]
  disabled: boolean
  onPick: (point: LatLng) => void
  view: MapView
}

function ClickCatcher({
  disabled,
  onPick,
}: {
  disabled: boolean
  onPick: (point: LatLng) => void
}) {
  const handlePick = useCallback(
    (point: LatLng) => {
      if (!disabled) onPick(point)
    },
    [disabled, onPick],
  )

  useMapEvents({
    click(e) {
      handlePick({ latitude: e.latlng.lat, longitude: e.latlng.lng })
    },
  })
  return null
}

function FitGuessAndTarget({ guess, target }: { guess: LatLng; target: LatLng }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(
      [
        [guess.latitude, guess.longitude],
        [target.latitude, target.longitude],
      ],
      { padding: [32, 32], maxZoom: 6 },
    )
  }, [map, guess, target])
  return null
}

function investigationIcon(index: number) {
  return divIcon({
    className: 'investigate-pin',
    html: `<span class="investigate-pin__num">${index + 1}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function stopPinClick(e: LeafletMouseEvent) {
  DomEvent.stopPropagation(e.originalEvent)
  e.originalEvent.stopPropagation()
}

export function AnswerMap({
  guess,
  target,
  investigations = [],
  disabled,
  onPick,
  view,
}: Props) {
  const showTarget = target != null
  const pins = investigations.slice(0, 3)

  return (
    <div className="answer-map-wrap">
      <MapContainer
        className="answer-map"
        center={[...view.center]}
        zoom={view.zoom}
        bounds={view.bounds ? [[...view.bounds[0]], [...view.bounds[1]]] : undefined}
        boundsOptions={view.bounds ? { padding: [16, 16], maxZoom: 6 } : undefined}
        minZoom={1}
        maxZoom={10}
        scrollWheelZoom
        worldCopyJump
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher disabled={disabled} onPick={onPick} />
        {pins.map((item, index) => (
          <Marker
            key={`${item.location.id}-${index}`}
            position={[item.location.latitude, item.location.longitude]}
            icon={investigationIcon(index)}
            zIndexOffset={200}
            eventHandlers={{ click: stopPinClick }}
          >
            <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
              {investigationPinLabel(index, item.location.name)}
            </Tooltip>
          </Marker>
        ))}
        {guess && (
          <CircleMarker
            center={[guess.latitude, guess.longitude]}
            radius={8}
            pathOptions={{
              color: '#fb8500',
              fillColor: '#ffb703',
              fillOpacity: 0.95,
              weight: 2,
            }}
          />
        )}
        {showTarget && (
          <CircleMarker
            center={[target.latitude, target.longitude]}
            radius={8}
            pathOptions={{
              color: '#126782',
              fillColor: '#219ebc',
              fillOpacity: 0.95,
              weight: 2,
            }}
          />
        )}
        {showTarget && guess && (
          <>
            <Polyline
              positions={[
                [guess.latitude, guess.longitude],
                [target.latitude, target.longitude],
              ]}
              pathOptions={{ color: '#d64550', weight: 2, dashArray: '6 6' }}
            />
            <FitGuessAndTarget guess={guess} target={target} />
          </>
        )}
      </MapContainer>
      <div className="map-legend">
        {pins.length > 0 && (
          <span className="map-legend__item map-legend__item--investigate">調査地点</span>
        )}
        <span className="map-legend__item map-legend__item--guess">あなたのピン</span>
        {showTarget && (
          <span className="map-legend__item map-legend__item--target">正解地点</span>
        )}
      </div>
    </div>
  )
}
