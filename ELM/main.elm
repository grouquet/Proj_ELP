module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (required)
import Html.Attributes exposing (placeholder,style)
import Html.Events exposing (onClick, onInput)
import Random

main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = \_ -> Sub.none
    , view = viewChairAlts
    }


type Model
  = Failure
  | Loading
  | Success String

type Msg
  = GotText (Result Http.Error String)

init : () -> (Model, Cmd Msg)
init _ =
  ( Loading
  , Http.get
      { url = "http://localhost:8000/source/1000.txt"
      , expect = Http.expectString GotText
      }
  )

--update
update : Msg -> Model -> (Model,Cmd Msg)

--view
viewChairAlts : List String -> Html msg
viewChairAlts chairAlts =
  div []
    [ p [] [ text "Chair alternatives include:" ]
    , ul [] (List.map viewAlt chairAlts)
    ]

viewAlt : String -> Html msg
viewAlt chairAlt =
  li [] [ text chairAlt ]