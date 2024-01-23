module Main exposing (..)

import Browser
import Html exposing (Html, button, div, input, text, h1, li, ul, ol)
import Html.Attributes exposing (placeholder, class)
import Html.Events exposing (onClick, onInput)
import Platform.Sub exposing (Sub)
import Http
import Random exposing (Generator, int, initialSeed, step, Seed)
import List exposing (head, drop)
import Maybe exposing (withDefault)
import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (required)

-- Model
type alias Model =
    { wordList : List String
    , inputText : String
    , message : String
    , answer : String
    , randomNum : Int
    , selectedWord : String 
    , dic : Dictionary
    }

type alias Dictionary = {word : String, meanings : List Meaning}
type alias Meaning = { partOfSpeech : String, definitions : List Definition }
type alias Definition ={definition : String}

init : Model
init =
    { wordList = []
    , inputText = ""
    , message = ""
    , answer = ""
    , randomNum = 1
    , selectedWord = ""
    , dic={word="",meanings=[]}
    } 

-- Type Msg
type Msg
    = SendHttpRequest
    | Submit
    | UpdateInput String
    | GotWords (Result Http.Error String)
    | ToggleAnswer
    | NewRandomNumber Int
    | GotJson (Result Http.Error (List Dictionary))

-- Update
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SendHttpRequest->
            (model,getWordlist)

        Submit ->
            if model.inputText == model.selectedWord then
                ( { model | message = "Yeah you're correct ！" }, Cmd.none )
            else
                ( { model | message = "Wrong, try again !" }, Cmd.none )

        ToggleAnswer ->
            ({ model | answer = ("The correct answer is " ++ model.selectedWord) }, Cmd.none )

        UpdateInput text ->
            ( { model | inputText = text }, Cmd.none )

        GotWords (Ok content) ->
            let
                wordList = String.words content
            in
            ( { model | wordList = wordList}, Random.generate NewRandomNumber (Random.int 0 999) )

        GotWords (Err error) ->
            ( { model | message = "error：" ++ httpErrorToString error }, Cmd.none )

        NewRandomNumber num -> 
            let z = getRandomWord num model.wordList
            in case z of
                ""-> ({ model | randomNum = num }, Cmd.none)
                _-> ({ model | randomNum = num, selectedWord=z }, getJson z)

        GotJson result ->
            case result of
                Ok meaning ->
                    ( { model | dic=(treat meaning)}, Cmd.none )
        
                Err error ->
                    ( { model | message = "error：" ++ httpErrorToString error }, Cmd.none )

treat: List Dictionary -> Dictionary
treat l= case  List.head  l of
        Just y ->y
        Nothing ->{word="",meanings=[]}    

-- Get the corresponding word
getRandomWord : Int -> List String -> String
getRandomWord randomNum wordList =
    case List.head (List.drop randomNum wordList) of
        Just y -> y
        Nothing -> ""

renderItem : String -> Html Msg
renderItem item =
    li [] [ text item ]


-- VIEW
view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Guess it!" ]
        , div [] [ ol [](viewDic model.dic.meanings) ]
        , input [ placeholder "Please input the correct word: ", onInput UpdateInput ] []
        , button [ onClick Submit ] [ text "Submit" ]
        , div [] [ text model.message ]
        , button [ onClick ToggleAnswer ] [ text "Show answer" ]
        , div [] [ text model.answer ]
        ]

-- Functions for view
viewDic: List Meaning -> List(Html Msg)
viewDic meanings = case meanings of
        []->[]
        (meaning :: rest)->li [] [text meaning.partOfSpeech, ol [](viewMeaning meaning.definitions)]  :: viewDic rest

viewMeaning: List Definition -> List (Html Msg)
viewMeaning defs= case defs of
        []->[]
        (definition :: rest)->li [] [viewDef definition] :: viewMeaning(rest)


viewDef : Definition -> Html Msg
viewDef def= case def.definition of
            ""->text "pas de def chacal"
            _->text def.definition

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

myDecoder : Decoder (List Dictionary)
myDecoder=list dicDecoder

dicDecoder: Decoder Dictionary
dicDecoder= Json.Decode.succeed Dictionary
        |> required "word" string
        |> required "meanings" (list meaningDecoder)

meaningDecoder :Decoder Meaning
meaningDecoder = Json.Decode.succeed Meaning
        |> required "partOfSpeech" string
        |> required "definitions" (list defDecoder)

defDecoder : Decoder Definition
defDecoder =
    Json.Decode.succeed Definition
        |> required "definition" string

getWordlist : Cmd Msg
getWordlist =
    Http.get
        { url = "http://localhost:8000/thousand_words_things_explainer.txt"
        , expect = Http.expectString GotWords 
        }

getJson : String -> Cmd Msg
getJson selectedWord = Http.get
        { url = "https://api.dictionaryapi.dev/api/v2/entries/en/" ++ selectedWord
        , expect = Http.expectJson GotJson myDecoder
        }

--Error string
httpErrorToString : Http.Error -> String
httpErrorToString error =
    case error of
        Http.BadUrl msg ->
            "Invalid URL: " ++ msg
        Http.Timeout ->
            "Timeout"
        Http.NetworkError ->
            "Network error"
        Http.BadStatus statusCode ->
            "Bad Status code: " ++ String.fromInt statusCode
        Http.BadBody msg ->
            "Bad body: " ++ msg

-- Main
main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> (init, getWordlist)
        , update = update
        , view = view
        , subscriptions = subscriptions
        }